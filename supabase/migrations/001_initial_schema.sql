-- Productos
CREATE TABLE productos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  categoria    TEXT NOT NULL CHECK (categoria IN ('colchon','base','almohada','protector')),
  descripcion  TEXT,
  materiales   TEXT,
  firmeza      SMALLINT CHECK (firmeza BETWEEN 1 AND 5),
  badge        TEXT,
  activo       BOOLEAN DEFAULT true,
  orden        SMALLINT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Medidas y precios por producto
CREATE TABLE producto_medidas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id     UUID REFERENCES productos(id) ON DELETE CASCADE,
  medida          TEXT NOT NULL,
  dimensiones     TEXT,
  precio_normal   INT NOT NULL,
  precio_rebajado INT,
  disponible      BOOLEAN DEFAULT true
);

-- Imágenes por producto
CREATE TABLE producto_imagenes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  tipo        TEXT DEFAULT 'frontal',
  orden       SMALLINT DEFAULT 0,
  alt         TEXT
);

-- Cotizaciones / leads
CREATE TABLE cotizaciones (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           TEXT NOT NULL,
  municipio        TEXT NOT NULL,
  telefono         TEXT NOT NULL,
  producto_interes TEXT,
  medida_interes   TEXT,
  comentario       TEXT,
  estado           TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo','contactado','vendido','descartado')),
  canal            TEXT DEFAULT 'web',
  valor_venta      INT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Índices útiles
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizaciones_created ON cotizaciones(created_at DESC);
