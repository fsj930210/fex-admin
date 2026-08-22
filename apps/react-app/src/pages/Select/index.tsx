import { Link } from 'react-router'
import { ClearDemo } from './clear-demo'
import { ChangeMetaDemo } from './change-meta-demo'
import { CustomRenderDemo } from './custom-render-demo'
import { CustomSearchDemo } from './custom-search-demo'
import { CustomTagDemo } from './custom-tag-demo'
import { EmptyDemo } from './empty-demo'
import { FormStatusDemo } from './form-status-demo'
import { GroupDemo } from './group-demo'
import { LocalSearchDemo } from './local-search-demo'
import { MaxCountDemo } from './max-count-demo'
import { MultiFieldSearchDemo } from './multi-field-search-demo'
import { MultipleDemo } from './multiple-demo'
import { PrefixSuffixDemo } from './prefix-suffix-demo'
import { PopupRenderDemo } from './popup-render-demo'
import { RemoteSearchDemo } from './remote-search-demo'
import { SingleDemo } from './single-demo'
import { TagsDemo } from './tags-demo'
import { VirtualDemo } from './virtual-demo'

export function SelectPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Select</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Single, multiple and tags selection with local or remote search, grouping and optional
              virtualization.
            </p>
          </div>
        </header>
        <div className="grid gap-space-xl">
          <SingleDemo />
          <MultipleDemo />
          <TagsDemo />
          <ClearDemo />
          <MaxCountDemo />
          <ChangeMetaDemo />
          <CustomTagDemo />
          <PrefixSuffixDemo />
          <FormStatusDemo />
          <PopupRenderDemo />
          <GroupDemo />
          <CustomRenderDemo />
          <LocalSearchDemo />
          <MultiFieldSearchDemo />
          <CustomSearchDemo />
          <RemoteSearchDemo />
          <EmptyDemo />
          <VirtualDemo />
        </div>
      </div>
    </main>
  )
}
