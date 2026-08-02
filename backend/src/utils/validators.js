// src/utils/validators.js
// Validation schemas using Joi

const Joi = require('joi')

// ==========================================
// AUTH VALIDATORS
// ==========================================

const emailSignupSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(50)
        .trim()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must not exceed 50 characters'
        }),
    email: Joi.string()
        .required()
        .email()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email'
        }),
    password: Joi.string()
        .required()
        .min(6)
        .max(100)
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters'
        }),
    phone: Joi.string()
        .pattern(/^\d{10}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Phone must be 10 digits'
        })
})

const emailLoginSchema = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .lowercase()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required'
        })
})

const googleAuthSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'string.empty': 'Google token is required'
        })
})

// ==========================================
// INQUIRY VALIDATORS
// ==========================================

const createInquirySchema = Joi.object({
    name: Joi.string()
        .required()
        .min(2)
        .max(50)
        .trim()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters'
        }),
    email: Joi.string()
        .email()
        .lowercase()
        .optional()
        .allow(null)
        .messages({
            'string.email': 'Please provide a valid email'
        }),
    phone: Joi.string()
        .required()
        .pattern(/^\d{10}$/)
        .messages({
            'string.empty': 'Phone is required',
            'string.pattern.base': 'Phone must be 10 digits'
        }),
    destination: Joi.string()
        .required()
        .messages({
            'string.empty': 'Destination is required'
        }),
    travellers: Joi.string()
        .required()
        .valid('Solo', '2', '3', '4+')
        .messages({
            'string.empty': 'Number of travellers is required',
            'any.only': 'Invalid number of travellers'
        }),
    travelDate: Joi.date()
        .optional()
        .allow(null)
        .messages({
            'date.base': 'Invalid travel date'
        }),
    budget: Joi.string()
        .optional()
        .valid('Budget', 'Mid-range', 'Luxury', 'Ultra-luxury', 'Not decided')
        .messages({
            'any.only': 'Invalid budget option'
        }),
    specialRequests: Joi.string()
        .optional()
        .allow(null)
        .max(1000)
        .messages({
            'string.max': 'Special requests cannot exceed 1000 characters'
        })
})

// ==========================================
// DESTINATION VALIDATORS (Admin)
// ==========================================

const createDestinationSchema = Joi.object({
    name: Joi.string().required().min(2).max(100).trim().messages({
        'string.empty': 'Name is required'
    }),
    category: Joi.string().required().trim().messages({
        'string.empty': 'Category is required'
    }),
    categoryLabel: Joi.string().optional().allow('', null).trim(),
    price: Joi.string().required().trim().messages({
        'string.empty': 'Price is required'
    }),
    duration: Joi.string().required().trim().messages({
        'string.empty': 'Duration is required'
    }),
    rating: Joi.number().min(0).max(5).optional(),
    description: Joi.string().required().min(10).trim().messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters'
    }),
    highlights: Joi.array().items(Joi.string().trim()).optional(),
    image: Joi.string().optional().allow('', null).trim(),
    images: Joi.array().items(Joi.string().trim()).optional(),
    isActive: Joi.boolean().optional()
})

const updateDestinationSchema = createDestinationSchema.fork(
    ['name', 'category', 'price', 'duration', 'description'],
    (schema) => schema.optional()
)

// ==========================================
// VALIDATION FUNCTION
// ==========================================

const validate = (data, schema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false, // Show all errors, not just first one
        stripUnknown: true // Remove unknown fields
    })

    if (error) {
        const messages = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        }))
        return { valid: false, errors: messages }
    }

    return { valid: true, data: value }
}

module.exports = {
    validate,
    schemas: {
        emailSignup: emailSignupSchema,
        emailLogin: emailLoginSchema,
        googleAuth: googleAuthSchema,
        createInquiry: createInquirySchema,
        createDestination: createDestinationSchema,
        updateDestination: updateDestinationSchema
    }
}