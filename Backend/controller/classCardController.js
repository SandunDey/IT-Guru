import ClassCard from "../model/classCard.js"


export function addClassCard(req, res) {
    //check user is an admin
    // req.user="admin";
    req.user = { role: "admin" };
    //
    if (req.user == null) {
        res.status(401).json({
            message: "You need to Login First"
        })

    } else if (req.user.role != "admin") {
        res.status(401).json({
            message: "You are needed Administrative access"
        })

    } else if (req.user.role = "admin") {
        console.log("Adding Card");
        const body = {
            card_id: null,
            class_name: req.body.class_name,
            fee: req.body.fee,

        }
        ClassCard.find().sort({ _id: -1 }).limit(1).then((output) => {
            if (output.length == 0) {
                body.card_id = 1;
            } else {
                const lastCardId = Number(output[0].card_id);
                body.card_id = lastCardId + 1;
            }
            const card = new ClassCard(body);

            card.save()
                .then(() => {
                    res.status(200).json({
                        message: "Card added Successfully"
                    })
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        message: "Card added Failed"
                    })
                })

        }).catch(() => {
            res.status(500).json({
                message: "DataBase Problem"
            })
        })
    }

}

export function updatePlan(req, res) {
    //check user is an admin

    //
    if (req.user == null) {
        res.status(401).json({
            message: "You need to Login First"
        })
    } else if (req.user.role != "admin") {
        res.status(401).json({
            message: "You are needed Administrative access"
        })
    } else if (req.user.role = "admin") {
        const planId = req.params.id;
        MembershipPlan.findOneAndUpdate({
            plan_id: planId
        }, req.body)
            .then(
                () => {
                    res.status(200).json({ message: "Plan Update successful." })
                }
            )
            .catch(() => {
                res.status(500).json({ message: "Plan Update Failed." })
            })

    }

}

export function getClassCards(req, res) {
    ClassCard.find()
        .then((cards) => {
            res.status(200).json(cards);
        })
        .catch(() => {
            res.status(500).json({ message: "Error retrieving plans" })
        })
}

export function deletePlan(req, res) {

    if (req.user == null) {
        res.status(401).json({
            message: "You need to Login First"
        })
    } else if (req.user.role != "admin") {
        res.status(401).json({
            message: "You are needed Administrative access"
        })
    } else if (req.user.role = "admin") {
        const planId = req.params.id;
        MembershipPlan.findOneAndUpdate({
            plan_id: planId,
        }, {
            isDisabled: true
        })
            .then(
                () => {
                    res.status(200).json({ message: "Plan deleted successful." })
                }
            )
            .catch(() => {
                res.status(500).json({ message: "Plan deletion Failed." })
            })

    }
}

export function getSelectedPlan(req, res) {
    const class_name = req.params.class_name;
    MembershipPlan.findOne({
        class_name: class_name
    })
        .then((plan) => {
            if (plan != null) {
                res.status(200).json(plan);
            }
            else
                res.status(400).json({ message: "Product Not found" })
        })
        .catch(() => {
            res.status(500).json({ message: "Database Error" })
        })
}