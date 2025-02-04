import { Request, Response } from 'express'
import verifyMessage from '../handler-telegram/new-message'

export interface TelegramFrom {
  id: number
  is_bot: boolean
  first_name: string
  last_name: string
  username: string
  language_code: string
}

export interface TelegramChat {
  id: number
  first_name: string
  last_name: string
  username: string
  type: string
}

export interface TelegramNewTextMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: any
  text: string
  entities?: []
  reply_parameters?: any
  reply_markup?: any
}

export interface TelegramNewAudioMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: any
  audio: any
  entities?: []
}

export interface TelegramNewMovieMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: any
  movie: any
  entities?: []
}

export interface TelegramNewImageMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: any
  image: string
  entities?: []
}

export interface TelegramNewVCardMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: any
  vcard: string
  entities?: []
}

export interface TelegramNewLocationMessage {
  message_id: number
  from: TelegramFrom
  chat: TelegramChat
  date: any
  location: string
  entities?: []
}

export interface TelegramWebhook {
  update_id: number
  message: TelegramNewTextMessage
}

const receiveWebhook = async (req: Request, res: Response) => {

  const update: TelegramWebhook = req.body;

  console.log(update);

  console.log([{
    message: 'Message received',
    new_message: update.message.text,
    from: update.message.from,
    chat: update.message.chat,
    date: update.message.date,
    entities: update.message.entities
  }]);

  const response = await verifyMessage(update);

  res.status(200).send(JSON.stringify(response));

}

export default receiveWebhook;
