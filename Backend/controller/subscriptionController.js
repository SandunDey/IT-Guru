export function addSubscription(req, res) {
    req.user = { role: "student" };
    //
    if (req.user == null) {
        res.status(401).json({
            message: "You need to Login First"
        })

    } else if (req.user.role != "student") {
        res.status(401).json({
            message: "You are needed Administrative access"
        })

    } else if (req.user.role = "student") {
        console.log("Adding Subscription");
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
