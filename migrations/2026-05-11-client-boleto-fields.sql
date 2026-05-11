ALTER TABLE clients
  ADD COLUMN link_portal VARCHAR(500) NULL,
  ADD COLUMN observacoes_boleto TEXT NULL,
  ADD COLUMN status_boleto VARCHAR(30) NOT NULL DEFAULT 'Pendente';
