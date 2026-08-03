
const healthController = {
    getHealth: (_req, res) => {
        res.json({ status: "ok" });
    }
};

export default healthController;