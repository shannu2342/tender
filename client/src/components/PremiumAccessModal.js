import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Crown, ShieldCheck, Smartphone } from 'lucide-react';
import { paymentsService } from '../services/api';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useSiteSettings } from '../hooks/useSiteSettings';

const normalizeMobile = (value) => String(value || '').replace(/[^\d]/g, '').slice(-10);

const loadRazorpayScript = () => {
    if (window.Razorpay) return Promise.resolve(true);
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PremiumAccessModal = ({ open, onClose, onActivated, authOnly = false, onAuthenticated }) => {
    const site = useSiteSettings();
    const {
        user,
        isPremium,
        isLoggedIn,
        loginWithPassword,
        requestSignupOtp,
        verifySignupOtp,
        requestForgotOtp,
        verifyForgotOtp,
        setUser,
        refreshProfile
    } = useCustomerAuth();

    const [step, setStep] = useState(isLoggedIn ? 2 : 0);
    const [authView, setAuthView] = useState('login');
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState('');
    const [devOtp, setDevOtp] = useState('');

    const [loginMobile, setLoginMobile] = useState(user?.mobile || '');
    const [loginPassword, setLoginPassword] = useState('');

    const [signupName, setSignupName] = useState('');
    const [signupMobile, setSignupMobile] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupOtp, setSignupOtp] = useState('');
    const [signupRequestId, setSignupRequestId] = useState('');

    const [forgotMobile, setForgotMobile] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [forgotRequestId, setForgotRequestId] = useState('');

    const bodyRef = useRef(null);

    const amountText = useMemo(() => {
        const price = Number(site.premium.price || 0);
        return `${site.premium.currency} ${price.toLocaleString('en-IN')}`;
    }, [site.premium.currency, site.premium.price]);

    useEffect(() => {
        if (!open) return undefined;
        const prevOverflow = document.body.style.overflow;
        const prevPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPaddingRight;
        };
    }, [open]);

    useEffect(() => {
        if (!open || !bodyRef.current) return;
        bodyRef.current.scrollTop = 0;
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (isLoggedIn) {
            setStep(2);
        } else {
            setStep(0);
            setAuthView('login');
        }
    }, [open, isLoggedIn]);

    if (!open) return null;

    const resetState = () => {
        setStep(isLoggedIn ? 2 : 0);
        setAuthView('login');
        setMessage('');
        setDevOtp('');
        setBusy(false);
        setLoginPassword('');
        setSignupOtp('');
        setSignupRequestId('');
        setForgotOtp('');
        setForgotRequestId('');
    };

    const closeAndReset = () => {
        resetState();
        onClose?.();
    };

    const handleAuthed = (nextUser) => {
        if (authOnly) {
            onAuthenticated?.(nextUser);
            closeAndReset();
            return;
        }
        setStep(2);
    };

    const handleLogin = async () => {
        const mobile = normalizeMobile(loginMobile);
        if (mobile.length !== 10) {
            setMessage('Enter a valid 10-digit mobile number.');
            return;
        }
        if (!loginPassword) {
            setMessage('Enter your password.');
            return;
        }

        try {
            setBusy(true);
            setMessage('');
            setDevOtp('');
            const payload = await loginWithPassword({ mobile, password: loginPassword });
            setMessage('Login successful.');
            handleAuthed(payload.user);
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Unable to login right now.');
        } finally {
            setBusy(false);
        }
    };

    const handleSendSignupOtp = async () => {
        const mobile = normalizeMobile(signupMobile);
        if (!signupName.trim()) {
            setMessage('Enter your name.');
            return;
        }
        if (mobile.length !== 10) {
            setMessage('Enter a valid 10-digit mobile number.');
            return;
        }
        if ((signupPassword || '').length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }

        try {
            setBusy(true);
            setMessage('');
            const data = await requestSignupOtp({
                name: signupName.trim(),
                mobile,
                password: signupPassword
            });
            setSignupRequestId(data.requestId);
            setDevOtp(data.devOtp || '');
            setMessage('OTP sent successfully.');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Unable to send OTP right now.');
        } finally {
            setBusy(false);
        }
    };

    const handleVerifySignupOtp = async () => {
        if (!signupRequestId) {
            setMessage('Request OTP first.');
            return;
        }
        if ((signupOtp || '').length < 6) {
            setMessage('Enter 6-digit OTP.');
            return;
        }

        try {
            setBusy(true);
            setMessage('');
            const payload = await verifySignupOtp({
                requestId: signupRequestId,
                otp: signupOtp,
                mobile: normalizeMobile(signupMobile),
                name: signupName.trim(),
                password: signupPassword
            });
            setMessage('Signup successful.');
            handleAuthed(payload.user);
        } catch (error) {
            setMessage(error?.response?.data?.message || 'OTP verification failed.');
        } finally {
            setBusy(false);
        }
    };

    const handleSendForgotOtp = async () => {
        const mobile = normalizeMobile(forgotMobile);
        if (mobile.length !== 10) {
            setMessage('Enter a valid 10-digit mobile number.');
            return;
        }
        if ((forgotNewPassword || '').length < 6) {
            setMessage('New password must be at least 6 characters.');
            return;
        }

        try {
            setBusy(true);
            setMessage('');
            const data = await requestForgotOtp({ mobile });
            setForgotRequestId(data.requestId);
            setDevOtp(data.devOtp || '');
            setMessage('OTP sent successfully.');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Unable to send OTP right now.');
        } finally {
            setBusy(false);
        }
    };

    const handleVerifyForgotOtp = async () => {
        if (!forgotRequestId) {
            setMessage('Request OTP first.');
            return;
        }
        if ((forgotOtp || '').length < 6) {
            setMessage('Enter 6-digit OTP.');
            return;
        }

        try {
            setBusy(true);
            setMessage('');
            await verifyForgotOtp({
                requestId: forgotRequestId,
                otp: forgotOtp,
                mobile: normalizeMobile(forgotMobile),
                newPassword: forgotNewPassword
            });
            setMessage('Password updated successfully. Please login.');
            setAuthView('login');
            setLoginMobile(normalizeMobile(forgotMobile));
            setLoginPassword('');
            setForgotOtp('');
            setForgotRequestId('');
            setDevOtp('');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'OTP verification failed.');
        } finally {
            setBusy(false);
        }
    };

    const handlePayNow = async () => {
        try {
            setBusy(true);
            setMessage('');

            const orderResponse = await paymentsService.createOrder({ planCode: 'premium_tender_access' });
            const order = orderResponse.data;
            const loaded = await loadRazorpayScript();

            const completePayment = async (paymentId, signature) => {
                const verifyResponse = await paymentsService.verifyOrder({
                    orderId: order.orderId,
                    paymentId,
                    signature
                });
                await refreshProfile();
                if (verifyResponse?.data?.user) {
                    setUser(verifyResponse.data.user);
                }
                setStep(3);
                onActivated?.();
            };

            if (loaded && window.Razorpay && order.keyId) {
                const options = {
                    key: order.keyId,
                    amount: Number(order.amount) * 100,
                    currency: order.currency || 'INR',
                    name: site.name,
                    description: order.planName || site.premium.planName,
                    order_id: order.orderId,
                    prefill: {
                        name: user?.name || signupName,
                        email: user?.email || '',
                        contact: normalizeMobile(user?.mobile || loginMobile || signupMobile)
                    },
                    theme: { color: '#1e3a8a' },
                    handler: async (response) => {
                        await completePayment(response.razorpay_payment_id, response.razorpay_signature);
                    }
                };
                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', (resp) => {
                    setMessage(resp?.error?.description || 'Payment failed. Please try again.');
                    setBusy(false);
                });
                razorpay.open();
                return;
            }

            await completePayment(`mock_pay_${Date.now()}`, 'mock_signature');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Payment could not be completed.');
        } finally {
            setBusy(false);
        }
    };

    const modalContent = (
        <div className="premium-modal" role="dialog" aria-modal="true" aria-label="Premium access">
            <button type="button" className="premium-modal__backdrop" aria-label="Close premium access" onClick={closeAndReset} />
            <div className="premium-modal__panel">
                <div className="premium-modal__head">
                    <div className="chip-row">
                        <span className="chip chip--premium"><Crown size={14} /> Premium Access</span>
                        {isPremium ? <span className="chip chip--sky"><CheckCircle2 size={14} /> Active</span> : null}
                    </div>
                    <button type="button" className="mobile-nav__close" onClick={closeAndReset} aria-label="Close premium access">X</button>
                </div>

                <div className="premium-modal__body" ref={bodyRef}>
                    {authOnly ? (
                        <>
                            <h3 className="section-title title-sm">Login to Continue</h3>
                            <p className="section-subtitle">Login or signup with mobile number, then you will be redirected to Pricing for payment.</p>
                        </>
                    ) : (
                        <>
                            <h3 className="section-title title-sm">{site.premium.planName}</h3>
                            <p className="section-subtitle">Unlock all premium tenders, complete details, and fast-track opportunity discovery.</p>
                            <div className="premium-price">{amountText} <span>/ {site.premium.durationDays} days</span></div>
                            <div className="list-clean mt-12">
                                <div><ShieldCheck size={16} /> Unlimited premium tender visibility</div>
                                <div><Crown size={16} /> Priority opportunity access</div>
                                <div><Smartphone size={16} /> OTP-verified mobile account security</div>
                            </div>
                        </>
                    )}

                    {message ? <div className="notice mt-14">{message}</div> : null}
                    {devOtp ? <div className="notice mt-12"><strong>Dev OTP:</strong> {devOtp}</div> : null}

                    {isPremium || step === 3 ? (
                        <div className="notice notice--success mt-14">
                            <strong>Premium is active.</strong>
                            <p>You can now view all premium tenders.</p>
                        </div>
                    ) : null}

                    {!isLoggedIn && step === 0 ? (
                        <div className="grid gap-8 mt-14">
                            <div className="chip-row">
                                <button type="button" className={`btn ${authView === 'login' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAuthView('login')}>Login</button>
                                <button type="button" className={`btn ${authView === 'signup' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAuthView('signup')}>Signup</button>
                                <button type="button" className={`btn ${authView === 'forgot' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setAuthView('forgot')}>Forgot Password</button>
                            </div>

                            {authView === 'login' ? (
                                <>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input className="form-control" value={loginMobile} onChange={(e) => setLoginMobile(e.target.value)} placeholder="10-digit mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" className="form-control" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
                                    </div>
                                    <button type="button" className="btn btn-primary" disabled={busy} onClick={handleLogin}>
                                        {busy ? 'Logging in...' : 'Login'}
                                    </button>
                                </>
                            ) : null}

                            {authView === 'signup' ? (
                                <>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input className="form-control" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Your name" />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input className="form-control" value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} placeholder="10-digit mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password" className="form-control" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Create password" />
                                    </div>
                                    <div className="cta-row">
                                        <button type="button" className="btn btn-secondary" disabled={busy} onClick={handleSendSignupOtp}>
                                            {busy ? 'Sending...' : 'Send OTP'}
                                        </button>
                                        <div className="form-group" style={{ marginBottom: 0, flex: '1 1 140px' }}>
                                            <input className="form-control" value={signupOtp} onChange={(e) => setSignupOtp(e.target.value)} placeholder="Enter OTP" />
                                        </div>
                                        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleVerifySignupOtp}>
                                            {busy ? 'Verifying...' : 'Verify & Signup'}
                                        </button>
                                    </div>
                                </>
                            ) : null}

                            {authView === 'forgot' ? (
                                <>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input className="form-control" value={forgotMobile} onChange={(e) => setForgotMobile(e.target.value)} placeholder="10-digit mobile" />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input type="password" className="form-control" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} placeholder="New password" />
                                    </div>
                                    <div className="cta-row">
                                        <button type="button" className="btn btn-secondary" disabled={busy} onClick={handleSendForgotOtp}>
                                            {busy ? 'Sending...' : 'Send OTP'}
                                        </button>
                                        <div className="form-group" style={{ marginBottom: 0, flex: '1 1 140px' }}>
                                            <input className="form-control" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} placeholder="Enter OTP" />
                                        </div>
                                        <button type="button" className="btn btn-primary" disabled={busy} onClick={handleVerifyForgotOtp}>
                                            {busy ? 'Verifying...' : 'Reset Password'}
                                        </button>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    ) : null}

                    {(isLoggedIn && !isPremium && step >= 2) ? (
                        <div className="grid gap-8 mt-14">
                            <button type="button" className="btn btn-success" disabled={busy || !site.premium.enabled} onClick={handlePayNow}>
                                {busy ? 'Processing...' : `Pay ${amountText} with Razorpay`}
                            </button>
                            {!site.premium.enabled ? <p className="section-subtitle">Premium access is currently disabled by admin.</p> : null}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default PremiumAccessModal;
