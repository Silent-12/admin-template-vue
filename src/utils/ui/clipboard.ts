/**
 * 剪贴板工具函数
 * 提供统一的文本复制能力，并封装成功与失败提示。
 */

/**
 * @description 选中文本域中的全部内容，兼容移动端与桌面端的复制前置操作。
 * @param {HTMLTextAreaElement} textarea 承载待复制文本的文本域元素。
 * @return {void} 无返回值。
 */

import { ElMessage } from 'element-plus'
function selectTextareaContent(textarea: HTMLTextAreaElement): void {
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
}

/**
 * @description 使用隐藏文本域和命令复制文本，兼容移动端与桌面端浏览器。
 * @param {string} text 需要复制的文本内容。
 * @return {boolean} 是否复制成功。
 */
function copyTextByCommand(text: string): boolean {
  if (!text.trim()) {
    return false
  }

  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  textarea.style.zIndex = '-1'
  textarea.style.contain = 'strict'
  textarea.style.fontSize = '16px'

  document.body.appendChild(textarea)

  const selection = document.getSelection()
  const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  selectTextareaContent(textarea)
  const isCopied = document.execCommand('copy')

  if (selection) {
    selection.removeAllRanges()
    if (savedRange) {
      selection.addRange(savedRange)
    }
  }

  document.body.removeChild(textarea)

  return isCopied
}

/**
 * @description 复制文本到系统剪贴板，并在复制结果返回后给出提示。
 * @param {string} text 需要复制的文本内容。
 * @param {string} successMessage 复制成功后的提示文案。
 * @return {Promise<boolean>} 是否复制成功。
 */
export async function copyText(
  text: string,
  successMessage: string = '复制成功'
): Promise<boolean> {
  if (!text.trim()) {
    ElMessage.warning('暂无可复制内容')
    return false
  }

  if (!copyTextByCommand(text)) {
    ElMessage.error('复制失败，请稍后重试')
    return false
  }

  ElMessage.success(successMessage)
  return true
}
