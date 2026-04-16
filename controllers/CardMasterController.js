import CardMasterService from '../service/CardMasterService';

export class CardMasterController {
  async initialize() {
    await CardMasterService.initialize();
    return CardMasterService.getAllCards();
  }
}
