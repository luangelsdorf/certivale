export default function BasicLayout({ children, pageTitle }) {
  return (
    <div className="container-fluid container-application">
      <div className="main-content position-relative">
        <div className="page-content">
          {
            pageTitle && (
              <div className="page-title">{pageTitle}</div>
            )
          }
          {children}
        </div>
      </div>
    </div>
  )
}