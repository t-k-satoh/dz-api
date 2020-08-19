const secured = () => {
    return function secured(req: any, res: any, next: any) {
        if (req.user) {
            return next();
        }
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    };
};

export { secured };
