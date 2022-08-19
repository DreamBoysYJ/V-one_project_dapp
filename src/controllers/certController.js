import Certification from "../models/Certification.js";
import User from "../models/User.js";

export const getInvoke = (req,res) => {
    return res.render("invoke", {pageTitle: "인증서 등록"});

};

export const postInvoke = async (req,res) => {
    const {user: {_id}} = req.session;
    const {pdf, thumb} = req.files;


    const {certificateName, description, certHash, userID} = req.body;

    console.log(certificateName, description, certHash, userID);

    try {
        const newCert = await Certification.create({
            title:certificateName,
            description,
            fileUrl: pdf[0].path,
            thumbUrl: thumb[0].path,
            owner: _id,
        });
        const user = await User.findById(_id);
        user.certifications.push(newCert._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "인증서 등록",
            errorMessage: error_message,
        });
    }

};

export const getQuery = async (req,res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "certifications",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    console.log(user);
    if(!user) {
        return res.status(404).render("404", {pageTitle: "사용자를 찾을 수 없습니다."});
    }
    return res.render("query", {
        pageTitle: user.name,
        user,
    });
};

export const test = (req,res) => {
    console.log(req.params);
}

export const getQueryDetail = async (req,res) => {
    const {certid} = req.params;

    const certification = await Certification.findById(certid).populate("owner");
    if(!certification){
        return res.render("404", {pageTitle: "증명서를 찾지 못했습니다."})
    }
    console.log(certification);
    return res.render("querydetail", {pageTitle: certification.title, certification});

}