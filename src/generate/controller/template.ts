const templateController = `
import { Get } from '../../utils/decorators/Methods'

export class NOMECONTROLLER {

    @Get('/')
    all() {

        return 'NOMECONTROLLER works!'

    }

}
`

export default templateController
