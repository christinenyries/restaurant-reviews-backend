import { ObjectId } from "mongodb"

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return
        }

        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        } catch (err) {
            console.error(`Unable to establish collection handles in reviewsDAO: ${e}`)
        }
    }
    static async addReview(restaurantId, userInfo, review, date) {
        try {
            const reviewDoc = {
                user_id: userInfo._id,
                name: userInfo.name,
                date: date,
                restaurant_id: new ObjectId(restaurantId),
                text: review,
            }

            return await reviews.insertOne(reviewDoc)
        } catch (err) {
            console.error(`Unable to post review, ${err}`)
            return { error: err }
        }
    }
    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { _id: new ObjectId(reviewId), user_id: userId, },
                { $set: { text: text, date: date } }
            )
            return updateResponse
        } catch (err) {
            console.error(`Unable to update review: ${err}`)
            return { error: err }
        }
    }
    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne(
                { _id: new ObjectId(reviewId), user_id: userId, },
            )
            return deleteResponse
        } catch (err) {
            console.error(`Unable to delete review: ${err}`)
            return { error: err }
        }
    }
}