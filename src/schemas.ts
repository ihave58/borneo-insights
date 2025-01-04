import Joi from 'joi';
import { EventType } from './services/InsightsService';

const EventSchema = Joi.object({
    timestamp: Joi.number().integer().positive().required(),
    customer_id: Joi.string().min(8).required(),
    item_id: Joi.string().min(8).required(),
    event_type: Joi.string()
        .valid(...Object.values(EventType))
        .required(),
    price: Joi.alternatives().conditional('event_type', {
        is: EventType.Purchase,
        then: Joi.number().positive().required(),
        otherwise: null,
    }),
});

export { EventSchema };
