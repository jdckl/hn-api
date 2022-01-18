declare namespace Express {
    interface Request {
        currentUser: {
            userId: number;
            email: string;
        };
    }
}