import Joi from 'joi';


export const registerSchema = Joi.object({
name: Joi.string().min(2).required(),
email: Joi.string().email().required(),
password: Joi.string().min(6).required()
});


export const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required()
});


export const customerSchema = Joi.object({
name: Joi.string().required(),
email: Joi.string().email().allow('', null),
phone: Joi.string().allow('', null),
company: Joi.string().allow('', null)
});


export const leadSchema = Joi.object({
title: Joi.string().required(),
description: Joi.string().allow('', null),
status: Joi.string().valid('New','Contacted','Converted','Lost'),
value: Joi.number().min(0)
});