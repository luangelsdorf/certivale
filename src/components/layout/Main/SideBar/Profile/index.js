import styles from './Profile.module.scss';
import UserGroup from '@icons/user-group.svg';
import BallotCheck from '@icons/ballot-check.svg';
import Receipt from '@icons/receipt.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Profile({ content }) {
  const { data: session } = useSession();
  return (
    <div className="sidenav-user d-flex flex-column align-items-center justify-content-between text-center">
      {/* Avatar */}
      <div>
        <a href="#" className="avatar rounded-circle avatar-xl">
          <Image fill alt="Foto de perfil" src="/images/user.jpg" />
        </a>
        <div className="mt-4">
          <h5 className="mb-0 text-white">{(session?.user?.name ?? session?.user?.nome)?.split(' ')[0]}</h5>
          <span className="d-block text-sm text-white opacity-8">Gerente de Marketing</span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-100 actions d-flex justify-content-between">
        <Link href="#clientes" className="action-item action-item-lg text-white pl-0">
          <UserGroup height="20" />
        </Link>
        <Link href="#relatorios" className="action-item action-item-lg text-white">
          <BallotCheck height="20" />
        </Link>
        <Link href="#notas" className="action-item action-item-lg text-white pr-0">
          <Receipt height="20" />
        </Link>
      </div>
    </div>
  )
}
