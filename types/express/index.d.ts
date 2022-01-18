declare namespace Express {
    interface Request {
        currentUser: {
            userId: string;
            email: string;
        };
    }
}