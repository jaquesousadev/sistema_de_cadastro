const express = require("express");
const router = express.Router();
const db = require("../config/db");

const MESES_REAJUSTE = {
    1: "janeiro",
    2: "fevereiro",
    3: "marco",
    4: "abril",
    5: "maio",
    6: "junho",
    7: "julho",
    8: "agosto",
    9: "setembro",
    10: "outubro",
    11: "novembro",
    12: "dezembro"
};

// Rota para buscar os numeros do dashboard
router.get("/dashboard-data", async (req, res) => {
    try {
        console.log("Recebida requisicao para /dashboard/dashboard-data");
        db.query("SELECT COUNT(*) AS total FROM clients", (err, clientes) => {
            if (err) {
                console.error("Erro ao buscar total de clientes:", err);
                return res.status(500).json({ success: false, message: "Erro no servidor" });
            }

            const totalClientes = clientes[0]?.total || 0;
            console.log("Total de clientes:", totalClientes);

            const hoje = new Date().toISOString().split("T")[0];
            console.log("Data de hoje:", hoje);

            db.query("SELECT COUNT(*) AS vencendo FROM clients WHERE vencimento = ?", [hoje], (err, clientesVencendo) => {
                if (err) {
                    console.error("Erro ao buscar clientes vencendo:", err);
                    return res.status(500).json({ success: false, message: "Erro no servidor" });
                }
                const totalVencendo = clientesVencendo[0]?.vencendo || 0;
                console.log("Clientes vencendo hoje:", totalVencendo);

                res.json({
                    success: true,
                    totalClientes: totalClientes,
                    clientesVencendo: totalVencendo
                });
            });
        });
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        res.status(500).json({ success: false, message: "Erro no servidor" });
    }
});

// Rota para buscar empresas com reajuste no mes informado
router.get("/empresas-reajuste/:mes", async (req, res) => {
    try {
        const mes = Number(req.params.mes);

        if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
            return res.status(400).json({ error: "Mes invalido" });
        }

        const mesFormatado = String(mes).padStart(2, "0");
        const nomeMes = MESES_REAJUSTE[mes];
        const query = `
            SELECT id, empresa
            FROM clients
            WHERE mes_reajuste IN (?, ?, ?)
            ORDER BY empresa ASC
        `;

        db.query(query, [mes, mesFormatado, nomeMes], (err, results) => {
            if (err) {
                console.error("Erro ao buscar empresas:", err);
                return res.status(500).json({
                    error: "Erro ao buscar empresas",
                    message: err.message
                });
            }
            res.json(results);
        });
    } catch (error) {
        console.error("Erro interno ao buscar empresas com reajuste:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

module.exports = router;
