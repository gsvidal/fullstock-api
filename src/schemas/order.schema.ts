import * as z from "zod"

const createOrderBodySchema = z.object({
  email: z.email(),

})