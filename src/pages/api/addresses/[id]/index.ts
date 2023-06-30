import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { addressValidationSchema } from 'validationSchema/addresses';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.address
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAddressById();
    case 'PUT':
      return updateAddressById();
    case 'DELETE':
      return deleteAddressById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAddressById() {
    const data = await prisma.address.findFirst(convertQueryToPrismaUtil(req.query, 'address'));
    return res.status(200).json(data);
  }

  async function updateAddressById() {
    await addressValidationSchema.validate(req.body);
    const data = await prisma.address.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAddressById() {
    const data = await prisma.address.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
