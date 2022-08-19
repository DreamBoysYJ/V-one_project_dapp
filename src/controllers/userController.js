import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getJoin = (req,res) => {
    res.render("join", {pageTitle: "회원가입"});
};

export const postJoin = async (req, res) => {
    const {id, name} = req.body;
    

    console.log(id, name);


    try {await User.create({
        id,
        name,
    });
    res.redirect("/login");
} catch(error){
    return res.status(400).render("join", {
        pageTitle: "회원가입",
        errorMessage: error._message,
    });
}
};


export const getLogin = (req,res) => {
    res.render("login", {pageTitle: "로그인"})
};

export const postLogin = async (req,res) => {
    const {id} = req.body;
    const pageTitle = "로그인";
    const user = await User.findOne({id});
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "아이디가 존재하지 않습니다.",
        });
    } 
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");

};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
    
};