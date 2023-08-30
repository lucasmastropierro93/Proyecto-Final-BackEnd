const { userModel } = require("./models/user.model");
class UserManagerMongo {
  constructor(){
    this.userModel = userModel
  }
  async getUser(email) {
   
    try {
      return await this.userModel.findOne(email);
    } catch (error) {
      console.log("error en getusers");
    }
  }
  async getUserById(uid) {
    try {
      return await this.userModel.findById({ _id: uid });
    } catch (error) {
      console.log("error en getuserbyid");
    }
  }
  async getUserByEmail(email) {
    try {
      return await this.userModel.findOne({ email: email });
    } catch (error) {
      console.log("error en getuserbyemail");
    }
  }
  async createUser(newUser) {
    try {
        return await this.userModel.create(newUser)
    } catch (error) {
        console.log("error en addUser");
    }
  }

  async updateUserByEmail(email, userToReplace)  {
    try {
        return await this.userModel.updateOne({ email: email }, userToReplace);
    } catch (error) {
        console.log("error updateuserbyemail");
    }
};
  async deleteUser(uid) {
    try {
        return await this.userModel.findByIdAndDelete({_id: uid})
    } catch (error) {
        console.log("error en deletuser");
    }
  }
  async updateUser(uid, updateData){
    try {
      return await this.userModel.updateOne({_id: uid},{ $set: updateData})
    } catch (error) {
      console.log("error en updateuser");
    }
  }
  async getAllUsers(){
    try {
      return await this.userModel.find({}).lean()
    } catch (error) {
      console.log("error en all users");
    }
  }
}
module.exports =  UserManagerMongo;
