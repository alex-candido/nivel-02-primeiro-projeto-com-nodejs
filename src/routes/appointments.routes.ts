import { parseISO, startOfHour } from 'date-fns';
import { Router } from 'express';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta

// SoC: Separations of concerns (Separação de preocupações)
appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const appointmentDate = startOfHour(parsedDate);

  const findAppointmentInSameDate =
    appointmentsRepository.findByDate(parsedDate);

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = appointmentsRepository.create({
    provider,
    date: appointmentDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
