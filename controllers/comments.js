const Complaint = require("../models/complaint");
const Comment = require("../models/comment");
const User = require("../models/user")

module.exports.addComment = async (req, res) => {
    const {id} = req.params
    const {body, rating} = req.body.comment
    const comment = new Comment({body, rating})
    const user = await User.findOne({googleID: req.user.id})
    comment.user = user._id
    console.log(comment)
    console.log(user)
    const complaint = await Complaint.findById(id)
    complaint.comments.push(comment._id)
    await comment.save()
    await complaint.save()
    req.flash('success', 'Comment submitted')
    res.redirect(`/complaints/${id}`)
}

module.exports.deleteComment = async (req, res) => {
    const {commentId, id} = req.params
    const complaint = await Complaint.findByIdAndUpdate(id, {$pull : {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    res.redirect(`/complaints/${id}`)
}