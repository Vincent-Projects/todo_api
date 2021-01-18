exports.getTodos = (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            todos: [
                {
                    _id: "64225H23524J3244J",
                    task: "Clean the kitchen",
                    done: true,
                    archived: false
                },
                {
                    _id: "65g4ez86gze4165g4",
                    task: "Help Jim for his homework",
                    done: false,
                    archived: false,
                },
                {
                    _id: "8gez7g4ze64g654ze",
                    task: "Cook some cookies :)",
                    done: false,
                    archived: false,
                },
                {
                    _id: "64225H23524J3244J",
                    task: "Pay the bills",
                    done: true,
                    archived: true
                }
            ]
        }
    })
}