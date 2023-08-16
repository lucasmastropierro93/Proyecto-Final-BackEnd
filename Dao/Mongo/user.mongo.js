const { userModel } = require("./models/user.model");
class UserManagerMongo {
  async getUser(email) {
    try {
      return await userModel.findOne(email);
    } catch (error) {
      console.log("error en getusers");
    }
  }
  async getUserById(uid) {
    try {
      return await userModel.findById({ _id: uid });
    } catch (error) {
      console.log("error en getuserbyid");
    }
  }
  async getUserByEmail(email) {
    try {
      return await userModel.findOne({ email: email });
    } catch (error) {
      console.log("error en getuserbyemail");
    }
  }
  async createUser(newUser) {
    try {
        return await userModel.create(newUser)
    } catch (error) {
        console.log("error en addUser");
    }
  }

  async updateUserByEmail(email, userToReplace)  {
    try {
        return await userModel.updateOne({ email: email }, userToReplace);
    } catch (error) {
        console.log("error updateuserbyemail");
    }
};
  async deleteUser(uid) {
    try {
        return await userModel.findByIdAndDelete({_id: uid})
    } catch (error) {
        console.log("error en deletuser");
    }
  }
  async updateUser(uid,currentDate){
    try {
      return await userModel.updateOne({_id: uid},{ $set:{last_connection: currentDate}})
    } catch (error) {
      console.log("error en updateuser");
    }
  }
}
module.exports =  UserManagerMongo;
