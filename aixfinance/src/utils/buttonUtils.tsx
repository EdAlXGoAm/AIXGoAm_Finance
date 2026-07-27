import { faPencil, faTrash, faSpinner, faChartLine, faPlus, faBox, faCartShopping, faDollarSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export const FaButtonEdit = () => {
  return <FontAwesomeIcon icon={faPencil} />;
}
export const FaButtonDelete = () => {
  return <FontAwesomeIcon icon={faTrash} />;
}
export const FaButtonTracking = () => {
  return <FontAwesomeIcon icon={faChartLine} />;
}
export const FaButtonAdd = () => {
  return <FontAwesomeIcon icon={faPlus} />;
}
export const FaButtonInventory = () => {
  return <FontAwesomeIcon icon={faBox} />;
}
export const FaButtonPurchase = () => {
  return <FontAwesomeIcon icon={faDollarSign} />;
}
export const FaButtonAddToCart = () => {
  return <FontAwesomeIcon icon={faCartShopping} />;
}
export const FaButton = ({
  children,
  onClick,
  beforeColor,
  afterColor,
  loading
}: {
  children: React.ReactNode,
  onClick: () => void,
  beforeColor?: string,
  afterColor?: string,
  loading?: boolean
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <pre
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        color: isHovered ? afterColor : beforeColor,
        cursor: 'pointer'
      }}
    >
      {loading ? <FontAwesomeIcon icon={faSpinner} /> : children}
    </pre>
  )
}
