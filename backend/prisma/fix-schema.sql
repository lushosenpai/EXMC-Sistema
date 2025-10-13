-- Migración complementaria: Agregar campos faltantes
-- Ejecutada automáticamente si la BD ya existe

-- Agregar campos faltantes a sales si no existen
DO $$ 
BEGIN
    -- Agregar amountPaid si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='sales' AND column_name='amountPaid') THEN
        ALTER TABLE "sales" ADD COLUMN "amountPaid" DOUBLE PRECISION;
    END IF;

    -- Agregar change si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='sales' AND column_name='change') THEN
        ALTER TABLE "sales" ADD COLUMN "change" DOUBLE PRECISION;
    END IF;
END $$;

-- Crear tabla customer_payments si no existe
CREATE TABLE IF NOT EXISTS "customer_payments" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "customer_payments_pkey" PRIMARY KEY ("id")
);

-- Agregar foreign key si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'customer_payments_customerId_fkey'
    ) THEN
        ALTER TABLE "customer_payments" ADD CONSTRAINT "customer_payments_customerId_fkey" 
        FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
