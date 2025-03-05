const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Importa a conexão com o banco de dados

// Rota para buscar os números do dashboard
router.get('/dashboard-data', async (req, res) => {
    try {
        console.log("Recebida requisição para /dashboard/dashboard-data");
        db.query('SELECT COUNT(*) AS total FROM clients', (err, clientes) => {
            if (err) {
                console.error("Erro ao buscar total de clientes:", err);
                return res.status(500).json({ success: false, message: "Erro no servidor" });
            }

            const totalClientes = clientes[0]?.total || 0;
            console.log("Total de clientes:", totalClientes);

            const hoje = new Date().toISOString().split('T')[0];
            console.log("Data de hoje:", hoje);

            db.query('SELECT COUNT(*) AS vencendo FROM clients WHERE vencimento = ?', [hoje], (err, clientesVencendo) => {
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

// Rota para buscar empresas com reajuste no mês informado
router.get('/empresas-reajuste/:mes', async (req, res) => {
    try {
        const mes = req.params.mes; // Obtém o mês da URL
        const query = 'SELECT id, empresa FROM clients WHERE mes_reajuste = ?';
        
        db.query(query, [mes], (err, results) => {
            if (err) {
                console.error('Erro ao buscar empresas:', err);
                return res.status(500).json({ error: 'Erro ao buscar empresas' });
            }
            res.json(results); // Retorna a lista de empresas
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
