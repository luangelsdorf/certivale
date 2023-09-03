import BackGround from 'public/images/svg/backgrounds/bg-4.svg';
import Logo from 'public/images/logo-primary.svg';

export default function Error404() {
  return (
    <div className="min-vh-100 h-100vh py-5 d-flex align-items-center bg-gradient-primary">
      <div className="bg-absolute-cover vh-100 overflow-hidden d-none d-md-block">
        <Logo width="150" style={{ height: 'auto', top: '5%', left: '5%' }} className="position-absolute" />
        <figure className="w-100">
          {/* <img alt="Image placeholder" src="../../assets/img/svg/backgrounds/bg-4.svg" className="svg-inject" /> */}
          <BackGround />
        </figure>
      </div>
      <div className="container position-relative zindex-100">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 px-5 px-lg-0">
            <h6 className="display-1 mb-3 font-weight-600 text-white">Ainda em construção</h6>
            <p className="lead text-lg text-white mb-5">
              Desculpe, esta parte do sistema ainda está sendo concluída.
            </p>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <figure className="w-100">
              <img alt="Image placeholder" src="/images/coming-soon.png" className="opacity-8 img-fluid" style={{ height: '500px' }} />
            </figure>
          </div>
        </div>
      </div>
    </div>

  )
}