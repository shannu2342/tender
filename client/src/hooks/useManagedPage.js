import { useEffect, useMemo, useState } from 'react';
import { pagesService } from '../services/api';

let pagesCache = null;
let pagesPromise = null;

const loadPages = async () => {
    if (pagesCache) return pagesCache;
    if (pagesPromise) return pagesPromise;

    pagesPromise = pagesService
        .getPages()
        .then((res) => {
            pagesCache = Array.isArray(res.data) ? res.data : [];
            return pagesCache;
        })
        .catch(() => {
            pagesCache = [];
            return pagesCache;
        })
        .finally(() => {
            pagesPromise = null;
        });

    return pagesPromise;
};

const parseManagedContent = (page) => {
    if (!page || !page.content) return {};
    if (typeof page.content !== 'string') return page.content;

    try {
        return JSON.parse(page.content);
    } catch {
        return { body: page.content };
    }
};

export const useManagedPage = (pageName, fallback = {}) => {
    const [managed, setManaged] = useState(null);

    useEffect(() => {
        let mounted = true;

        const run = async () => {
            const pages = await loadPages();
            const page = pages.find((p) => String(p.pageName || '').toLowerCase() === String(pageName).toLowerCase());
            if (!mounted || !page || page.enabled === false) return;

            const parsed = parseManagedContent(page);
            setManaged({
                ...parsed,
                title: parsed.title || page.title,
                metaTitle: parsed.metaTitle || page.metaTitle,
                metaDescription: parsed.metaDescription || page.metaDescription,
                updatedAt: page.updatedAt
            });
        };

        run();

        return () => {
            mounted = false;
        };
    }, [pageName]);

    return useMemo(() => {
        return {
            ...fallback,
            ...(managed || {})
        };
    }, [fallback, managed]);
};
