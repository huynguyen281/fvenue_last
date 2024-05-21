import { IconChevronLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { cn } from 'src/lib/utils'
import { Button, ButtonProps } from 'src/components/ui/button'

type Props = ButtonProps & {
  text?: string
}

function HomeButtton({ className, text = 'Quay lại', ...props }: Props) {
  const navigate = useNavigate()
  const onClick = () => {
    navigate('/')
  }
  return (
    <Button className={cn(className)} color={'secondary'} onClick={onClick} size={'sm'} {...props}>
      <IconChevronLeft className="mr-2 h-5 w-5" />
      {text}
    </Button>
  )
}

export default HomeButtton
