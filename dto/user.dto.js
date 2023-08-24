class UserDto{
    constructor(user){
        this.username= user.username
        this.email= user.email
        this.first_name= user.first_name
        this.role= user.role
        

    }
}

module.exports ={
    UserDto
}