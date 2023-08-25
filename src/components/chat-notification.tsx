import { useEffect } from 'react'

import IconWarning from '@/assets/images/warning.svg'
import { ChatError, ErrorCode, ChatMessageModel } from '@/lib/bots/bing/types'
import { ExternalLink } from './external-link'
import { BingReturnType } from '@/lib/hooks/use-bing'
import { SVG } from './ui/svg'

export interface ChatNotificationProps extends Pick<BingReturnType, 'bot'> {
  message?: ChatMessageModel
}

function getAction(error: ChatError, reset: () => void) {
  if (error.code === ErrorCode.THROTTLE_LIMIT) {
    reset()
    return (
      <div>
        你已达到每日最大发送消息次数，请<a href={`#dialog="settings"`}>更换账号</a>或隔一天后重试
      </div>
    )
  }
  if (error.code === ErrorCode.BING_IP_FORBIDDEN) {
    return "页面连接超时，请刷新页面或者清除cookie";
  }

  if (error.code === ErrorCode.BING_TRY_LATER) {
    return "页面连接超时，请刷新页面或者清除cookie";
  }

  if (error.code === ErrorCode.BING_FORBIDDEN) {
    return (
      <ExternalLink href="https://bing.com/new">
        你的账号已在黑名单 请尝试更换账号及申请解封
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.CONVERSATION_LIMIT) {
    return (
      <div>
        当前话题已中止，请
        <a href={`#dialog="reset"`}>重新开始</a>
        开启新的对话
      </div>
    )
  }
  if (error.code === ErrorCode.BING_CAPTCHA) {
    return (
      <ExternalLink href="https://www.bing.com/turing/captcha/challenge">
        点击通过人机验证
      </ExternalLink>
    )
  }
  if (error.code === ErrorCode.BING_UNAUTHORIZED) {
    reset()
    return (
      <a href={`#dialog="settings"`}>没有获取到身份信息或身份信息失效，点此重新设置</a>
    )
  }
  return error.message
}

export function ChatNotification({ message, bot }: ChatNotificationProps) {
  if (!message?.error) return

  return (
    <div
      className="notification-container"
    >
      <div className="bottom-notifications">
        <div className="inline-type with-decorative-line">
          <div className="text-container mt-1">
            <div className="title inline-flex items-start">
              <SVG alt="error" src={IconWarning} width={20} className="mr-1 mt-1" />
              {getAction(message.error, () => bot.resetConversation())}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
