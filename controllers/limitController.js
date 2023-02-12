import monthLimit from "../config/model/monthLimit.js";
import getToken from "../utility/getToken.js";



const getLimit = async (req, res) => {
    try {
        const token = req.cookies.token
        const deocodeToken = getToken(token)



        const getLimitData = await monthLimit.find({ uid: deocodeToken.id }).sort({ createdAt: -1 })

        return res.json({ data: getLimitData, success: true, msg: "Success" }).status(200)

    } catch (error) {
        return res.json({ msg: "Something went wrong please try again", data: [], sucess: false }).status(404)
    }
}

const setLimit = async (req, res) => {
    try {
        const token = req.cookies.token
        const deocodeToken = getToken(token)
        const { limit, month, to } = req.body;


        if (!month || !to || !limit) {
            return res.json({ msg: "something went wrong", sucess: false }).status(400)
        }

        const monthDate = new Date(month)
        const toDate = new Date(to)
        const toMonth = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 1)


        const result = await monthLimit.create({
            limit: limit,
            month: monthDate,
            to: toMonth,
            createdAt:new Date().getTime(),
            uid: deocodeToken.id
        })


        return res.json({ data: result, success: true, msg: "Sucessfully created" }).status(200)

    } catch (error) {
        return res.json({ msg: "something went wrong", sucess: false }).status(400)
    }

}
const updateAmount = async (req, res) => {
    try {
        const token = req.cookies.token
        const deocodeToken = getToken(token)
        const { limit, month, to,limitId } = req.body;
        if(!limit || !month || !to || !limitId){
            return res.json({msg:"Something went wrong no data",sucess:false}).status(400)
        }
        const monthDate = new Date(month)
        const toDate = new Date(to)
        const toMonth = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 1)

        const findResult = await monthLimit.find({uid:deocodeToken?.id,_id:limitId})
        if(findResult.length > 0){

           const result = await monthLimit.updateOne({_id:limitId,uid:deocodeToken.id}
            ,
            {
                $set:{
                    limit:limit,month:monthDate,to:toMonth
                }
            }
            )
            return res.json({data:[],msg:"success",success:true})

        }
        return res.json({ msg: "Something went wrong not limit found", sucess: false  })
        
        
    } catch (error) {
        return res.json({ msg: "Something went wrong", sucess: false  }).status(400)
    }
}

export { getLimit, setLimit, updateAmount };

