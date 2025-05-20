export interface PaymentAddRequest {
  buyerId: string // Guid в виде строки
  amount: number
  ticketIds: string[] // массив Guid в виде строк
}
