# ClipApp Payment System Setup

This document provides instructions for setting up the payment system for ClipApp.

## Prerequisites

1. A Stripe account (sign up at [stripe.com](https://stripe.com))
2. Next.js application with API routes

## Setup Steps

### 1. Create Stripe Products and Prices

1. Log in to your Stripe Dashboard
2. Go to Products > Create Product
3. Create the following products:
   - Pro Plan (monthly subscription)
   - Team Plan (monthly subscription)
4. Note the Price IDs for each product (they start with `price_`)

### 2. Set Environment Variables

Add the following environment variables to your `.env.local` file:

