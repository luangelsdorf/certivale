import styles from './Profile.module.scss';
import UserGroup from '@icons/user-group.svg';
import BallotCheck from '@icons/ballot-check.svg';
import Receipt from '@icons/receipt.svg';
import Link from 'next/link';
import Image from 'next/image';

export default function Profile({ content }) {
  return (
    <div className="sidenav-user d-flex flex-column align-items-center justify-content-between text-center">
      {/* Avatar */}
      <div>
        <a href="#" className="avatar rounded-circle avatar-xl">
          <Image fill alt="Foto de perfil" src="/images/profile-solange.png" />
        </a>
        <div className="mt-4">
          <h5 className="mb-0 text-white">Solange S.</h5>
          <span className="d-block text-sm text-white opacity-8">Diretora Operacional</span>
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
