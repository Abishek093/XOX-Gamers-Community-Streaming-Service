"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, userName, email, createdAt, updatedAt, isVerified, isGoogleUser, isBlocked, profileImage, bio, dateOfBirth) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isVerified = isVerified;
        this.isGoogleUser = isGoogleUser;
        this.isBlocked = isBlocked;
        this.profileImage = profileImage;
        this.bio = bio;
        this.dateOfBirth = dateOfBirth;
    }
}
exports.User = User;
