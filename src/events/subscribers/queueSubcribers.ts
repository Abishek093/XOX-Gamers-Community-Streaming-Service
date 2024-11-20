import { IUser, UserModel } from "../../commands/models/UserModel";
import { consumeQueue } from "../../infrastructure/broker/RabbitMQConsumer"; 

import CustomError from "../../shared/CustomError"; 


export const startQueueConsumer = () => {


  consumeQueue('streaming-service-create-user', async (userData) => {
    try {
      const newUser: IUser = {
        userId: userData.userId,
        username: userData.username,
        displayName: userData.displayName,
        profileImage: userData.profileImage,
        isBlocked: userData.isBlocked,
      };
      await UserModel.create(newUser);
      console.log('User created successfully in streaming service:', newUser);
    } catch (error) {
      console.error("Failed to create user:", error);
      throw new CustomError("Failed to create user: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    }
  });

  consumeQueue('streaming-service-update-user', async (userData) => {
    try {
      console.log('userData', userData)
    } catch (error) {
      console.error("Failed to update user:", error);
      throw new CustomError("Failed to update user: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    }
  });

  consumeQueue('streaming-service-update-profile-image', async (userData) => {
    try {
      console.log('userData', userData)
    } catch (error) {
      console.error("Failed to update profile image user:", error);
      throw new CustomError("Failed to update profile image user: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    }
  });

  consumeQueue('streaming-service-update-profile-image', async (userData) => {
    try {
      console.log('userData', userData)
    } catch (error) {
      console.error("Failed to update profile image user:", error);
      throw new CustomError("Failed to update profile image user: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    }
  });

  consumeQueue('streaming-service-block-user', async (userData) => {
    try {
      console.log('userData', userData)
    } catch (error) {
      console.error("Failed to update profile image user:", error);
      throw new CustomError("Failed to update profile image user: " + (error instanceof Error || error instanceof CustomError ? error.message : "Unknown error"), 500);
    }
  });
};

