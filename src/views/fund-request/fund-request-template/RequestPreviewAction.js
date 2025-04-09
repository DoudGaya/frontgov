// ** Reactstrap Imports
import { Card, CardBody, Button } from 'reactstrap'

const PreviewActions = ({onPrintPage }) => {
    return (
        <Card className='invoice-action-wrapper'>
            <CardBody>
                <Button color='secondary' onClick={onPrintPage} block outline className='mb-75'>
                    Download
                </Button>
                <Button color='secondary' onClick={onPrintPage}  block outline className='mb-75'>
                    Print
                </Button>
            </CardBody>
        </Card>
    )
}

export default PreviewActions