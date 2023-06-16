const { userModel } = require("./models/user.model");
class UserManagerMongo {
  async getUsers() {
    try {
      return await userModel.find({});
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
  async addUser(newUser) {
    try {
        return await userModel.create(newUser)
    } catch (error) {
        console.log("error en addUser");
    }
  }
  async updateUser(uid, data) {
    try {
        return await userModel.findByIdAndUpdate(uid, data)
    } catch (error) {
        console.log("error en updateuser");
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
}
module.exports =  UserManagerMongo;
