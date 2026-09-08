import React from 'react'
import { Composition } from 'remotion'
import { AuthHeroComposition } from './AuthHeroComposition'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AuthHero"
        component={AuthHeroComposition}
        durationInFrames={450}
        fps={30}
        width={800}
        height={600}
        defaultProps={{
          isDark: true,
        }}
      />
    </>
  )
}
