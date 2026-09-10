import React from 'react';
import ChatStudio from '../components/ChatStudio';

/* =====================================================================
   /chat
   A recording stage, deliberately without the site header and footer:
   anything else on the page is something that has to be cropped out of
   a take. Press H and the controls go too, leaving nothing but the
   stage.
   ===================================================================== */

export default function ChatPage() {
  return <ChatStudio />;
}
