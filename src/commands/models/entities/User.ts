export class User {
    constructor(
        public readonly id: string,
        public readonly userName: string,
        public readonly email: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly isVerified: boolean,
        public readonly isGoogleUser: boolean,
        public readonly isBlocked: boolean,
        public readonly profileImage?: string,
        public readonly bio?: string,
        public readonly dateOfBirth?: Date,
    ) {}
}
