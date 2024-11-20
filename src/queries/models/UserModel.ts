export class UserProfileReadModel {
  public readonly id: string;
  public readonly username: string;
  public readonly displayName: string;
  public readonly profileImage?: string;
  public readonly bio?: string;

  constructor(
    id: string,
    username: string,
    displayName: string,
    profileImage?: string,
    bio?: string,
  ) {
    this.id = id;
    this.username = username;
    this.displayName = displayName;
    this.profileImage = profileImage;
    this.bio = bio;
  }
}
