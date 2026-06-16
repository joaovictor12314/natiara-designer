import type { Appointment, Client, Requirement, RiskItem, Service } from "@/types";

export const services: Service[] = [
  {
    id: "sobrancelhas",
    name: "Design de Sobrancelhas",
    description: "Modelagem personalizada com acabamento natural e simetria facial.",
    price: 45,
    durationMinutes: 45,
    priority: "Alta"
  },
  {
    id: "limpeza-pele",
    name: "Limpeza de Pele",
    description: "Higienização profunda, extração controlada e finalização calmante.",
    price: 120,
    durationMinutes: 90,
    priority: "Alta"
  },
  {
    id: "extensao-cilios",
    name: "Extensão de Cílios",
    description: "Aplicação fio a fio para realce do olhar com durabilidade.",
    price: 160,
    durationMinutes: 120,
    priority: "Alta"
  }
];

export const requirements: Requirement[] = [
  { code: "RF.001", title: "Cadastro e login de clientes", priority: "Alta", testCases: ["CT-01", "CT-02"] },
  { code: "RF.002", title: "Visualizacao dos servicos", priority: "Alta", testCases: ["CT-03"] },
  { code: "RF.003", title: "Selecao de servicos", priority: "Alta", testCases: [] },
  { code: "RF.004", title: "Calculo da distancia", priority: "Alta", testCases: ["CT-03"] },
  { code: "RF.005", title: "Taxa de deslocamento", priority: "Alta", testCases: ["CT-04"] },
  { code: "RF.006", title: "Recuperacao de senha", priority: "Media", testCases: ["CT-05"] },
  { code: "RF.007", title: "Area administrativa", priority: "Alta", testCases: [] },
  { code: "RF.008", title: "Priorizacao de Goiania", priority: "Baixa", testCases: [] },
  { code: "RF.009", title: "Recursos de acessibilidade", priority: "Media", testCases: [] },
  { code: "RF.010", title: "Pagamentos online", priority: "Alta", testCases: ["CT-06"] },
  { code: "RF.011", title: "Cancelamento e reagendamento", priority: "Alta", testCases: ["CT-07"] }
];

export const riskMatrix: RiskItem[] = [
  { risk: "Vazamento de dados", probability: "Baixa", impact: "Alto", treatment: "Criptografia, JWT e 2FA" },
  { risk: "Falha no servidor", probability: "Baixa", impact: "Alto", treatment: "Backup diario e monitoramento" },
  { risk: "Falha no Pix", probability: "Media", impact: "Alto", treatment: "Testes de integracao" },
  { risk: "Erro na distancia", probability: "Media", impact: "Medio", treatment: "Testes automatizados" },
  { risk: "Lentidao do sistema", probability: "Media", impact: "Medio", treatment: "Consultas otimizadas e cache" }
];

export const testPlan = [
  { id: "CT-01", requirement: "RF.001", scenario: "Cadastro com e-mail invalido" },
  { id: "CT-02", requirement: "RF.001", scenario: "Senha menor que 8 caracteres" },
  { id: "CT-03", requirement: "RF.004", scenario: "Distancia superior a 10 km" },
  { id: "CT-04", requirement: "RF.005", scenario: "Cobranca de taxa" },
  { id: "CT-05", requirement: "RF.006", scenario: "Recuperacao de senha" },
  { id: "CT-06", requirement: "RF.010", scenario: "Pagamento via Pix" },
  { id: "CT-07", requirement: "RF.011", scenario: "Reagendamento" }
];

export const initialClients: Client[] = [
  {
    id: "cli-001",
    name: "Mariana Alves",
    email: "mariana@email.com",
    phone: "(62) 99912-4310",
    address: "Setor Bueno, Goiania",
    city: "Goiania"
  },
  {
    id: "cli-002",
    name: "Bianca Souza",
    email: "bianca@email.com",
    phone: "(62) 98220-1188",
    address: "Jardim America, Goiania",
    city: "Goiania"
  },
  {
    id: "cli-003",
    name: "Lais Ferreira",
    email: "lais@email.com",
    phone: "(62) 99444-2010",
    address: "Aparecida de Goiania",
    city: "Aparecida de Goiania"
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: "ag-001",
    customerName: "Mariana Alves",
    customerEmail: "mariana@email.com",
    customerPhone: "(62) 99912-4310",
    address: "Setor Bueno, Goiania",
    city: "Goiania",
    serviceIds: ["sobrancelhas"],
    scheduledAt: "2026-06-18T10:00",
    distanceKm: 7.4,
    displacementFee: 0,
    paymentMethod: "pix",
    status: "confirmado",
    total: 45,
    createdAt: "2026-06-10T09:30:00.000Z"
  },
  {
    id: "ag-002",
    customerName: "Bianca Souza",
    customerEmail: "bianca@email.com",
    customerPhone: "(62) 98220-1188",
    address: "Jardim America, Goiania",
    city: "Goiania",
    serviceIds: ["limpeza-pele"],
    scheduledAt: "2026-06-19T14:30",
    distanceKm: 11.2,
    displacementFee: 15,
    paymentMethod: "credito",
    status: "confirmado",
    total: 135,
    createdAt: "2026-06-11T13:10:00.000Z"
  },
  {
    id: "ag-003",
    customerName: "Lais Ferreira",
    customerEmail: "lais@email.com",
    customerPhone: "(62) 99444-2010",
    address: "Aparecida de Goiania",
    city: "Aparecida de Goiania",
    serviceIds: ["extensao-cilios", "sobrancelhas"],
    scheduledAt: "2026-06-21T09:00",
    distanceKm: 17,
    displacementFee: 15,
    paymentMethod: "debito",
    status: "pendente",
    total: 220,
    createdAt: "2026-06-12T16:00:00.000Z"
  }
];

export const weeklyRevenueSeed = [
  { label: "Sem 1", revenue: 420, appointments: 5 },
  { label: "Sem 2", revenue: 615, appointments: 7 },
  { label: "Sem 3", revenue: 760, appointments: 8 },
  { label: "Sem 4", revenue: 980, appointments: 10 }
];
