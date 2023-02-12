import categoryModel from "../config/model/categoryModel.js";
import expenseModel from "../config/model/expenseModel.js";
import monthLimit from "../config/model/monthLimit.js";
import getToken from "../utility/getToken.js";
import getMonthAndYear from "../utility/getMonthAndYear.js";


// <categroy Actions >

const getCategory = async (req, res) => {
    try {
        const limitId = req.query?.limitId;
        const uid = getToken(req.cookies.token);

        const result = await categoryModel.find({ uid: uid.id, limitId: limitId });


        if (result.length === 0 || result === null) {
            return res.status(200).json({ msg: "No category found for this Month Please Add Some", success: false, data: [] })
        }
        return res.json({ msg: "Success", data: result, success: true });

    } catch (error) {
        console.log(error);
        return res.json({ msg: "failed to find category", data: [], success: false }).status(400)
    }

}

const addCategory = async (req, res) => {
    try {
        const uid = getToken(req.cookies.token);
        const { name, limit, limitId } = req.body;


        if (!name) {
            return res.json({ msg: "Please Enter Proper Details" }).status(400)
        }
        const result = await categoryModel.create({
            name: name, limit: limit, uid: uid.id, limitId: limitId
        })

        return res.json({ msg: "Successfully Added Category", data: result, success: true }).status(200)



    } catch (error) {
        console.log(error);
        return res.json({ msg: "failed to Add, Try again. category name should be different from each other" }).status(400)
    }
}


const updateCategory = async (req, res) => {
    try {
        const { id, name, limit } = req.body;
        const { month, year } = getMonthAndYear(new Date())
        if (!id || !name || !limit) {
            return res.json({ msg: "Please try again All Fields are Required" }).status(400)
        }
        const uid = getToken(req.cookies.token);

        const getRemainingLimit = await monthLimit.findOne({ uid: uid.id, month: month, year: year })

        const oldCatLimit = await categoryModel.findOne({ _id: id, uid: uid.id });

        if ((getRemainingLimit.utilizedAmount - oldCatLimit.limit) + limit > getRemainingLimit.amount) {
            return res.json({ msg: "Limit exceeded" }).status(400);
        }
        else {
            const result = await categoryModel.updateOne({ _id: id, uid: uid.id },
                {
                    $set: {
                        name: name, limit: limit
                    }
                }
            )
            const limitAdjustment = limit - oldCatLimit.limit;
            await monthLimit.updateOne({ uid: uid.id, month: month, year: year },
                {
                    $inc: {
                        utilizedAmount: limitAdjustment
                    }
                }
            )
            return res.json({ msg: "Update Sucessful" }).status(200)
        }

    } catch (error) {
        res.json({ msg: "Error updating category" }).status(400)
    }
}



const deleteCategory = async (req, res) => {
    try {
        const categoryId = req?.query?.categoryId;

        if (!categoryId) {
            return res.json({ msg: "Failed", success: false }).status(200)
        }
        const result = await categoryModel.deleteOne({ _id: categoryId })
        const findUncategorizedId = await categoryModel.findOne({ name: "Uncategorized" })



        const uncat_id = findUncategorizedId?._id


        const result2 = await expenseModel.updateMany({ categoryId: categoryId }, {
            $set: {
                categoryId: uncat_id
            }
        })


        return res.json({ msg: "success", success: true }).status(200)

    } catch (error) {
        return res.json({ msg: "Something went wrong Please try again" }).status(400)
    }
}



const addCategoryFromLocalToDb = async (req, res) => {
    try {
        const { category, expenses, limitId } = req.body;

        const uid = getToken(req.cookies.token);
        const cloneCategory = await JSON.parse(JSON.stringify(category))

        const categories = cloneCategory?.map(cat => {
            delete (cat?.id)
            return { ...cat, uid: uid?.id }
        })
        const result = await categoryModel.insertMany(categories)


        const categoryIdMaped = category?.map(cat => {
            const resultCat = result?.find(res => res?.name === cat?.name)
            return { ...cat, _id: resultCat?._id }
        })

        if (expenses === null || expenses?.length === 0) {
            return res.json({ msg: "Success", success: true }).status(200)
        }

        const getUncategorizedId = await categoryModel.findOne({ name: "Uncategorized", limitId: limitId })

        const expenseMapped = expenses?.map(exp => {
            if (exp?.categoryId === "Uncategorized") {
                const catId = getUncategorizedId?._id
                delete (exp?.id)
                return { ...exp, categoryId: catId?._id, uid: uid?.id }
            }
            const catId = categoryIdMaped?.find(cat => cat?.id === exp?.categoryId)
            delete (exp?.id)
            return { ...exp, categoryId: catId?._id, uid: uid?.id }
        })

        
        const result2 = await expenseModel.insertMany(expenseMapped)


        return res.json({ msg: "Success", success: true }).status(200)

        // sultanbhokal123@gmail.com
        // Sultan@7207

    } catch (error) {
        console.log(error)
        return res.json({ msg: "Something went Wrong", success: false }).status(400)
    }
}

// </ Category Actions >






export { getCategory, addCategory, deleteCategory, updateCategory, addCategoryFromLocalToDb }