import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { ChangeMetaDemo } from './change-meta-demo.component'
import { ClearDemo } from './clear-demo.component'
import { CustomRenderDemo } from './custom-render-demo.component'
import { CustomSearchDemo } from './custom-search-demo.component'
import { CustomTagDemo } from './custom-tag-demo.component'
import { EmptyDemo } from './empty-demo.component'
import { FormStatusDemo } from './form-status-demo.component'
import { GroupDemo } from './group-demo.component'
import { LocalSearchDemo } from './local-search-demo.component'
import { MaxCountDemo } from './max-count-demo.component'
import { MultiFieldSearchDemo } from './multi-field-search-demo.component'
import { MultipleDemo } from './multiple-demo.component'
import { PopupRenderDemo } from './popup-render-demo.component'
import { PrefixSuffixDemo } from './prefix-suffix-demo.component'
import { RemoteSearchDemo } from './remote-search-demo.component'
import { SingleDemo } from './single-demo.component'
import { TagsDemo } from './tags-demo.component'
import { VirtualDemo } from './virtual-demo.component'
export
@Component({
  selector: 'fex-select-page',
  standalone: true,
  imports: [
    RouterLink,
    SingleDemo,
    MultipleDemo,
    TagsDemo,
    ClearDemo,
    MaxCountDemo,
    ChangeMetaDemo,
    CustomTagDemo,
    PrefixSuffixDemo,
    FormStatusDemo,
    PopupRenderDemo,
    GroupDemo,
    CustomRenderDemo,
    LocalSearchDemo,
    MultiFieldSearchDemo,
    CustomSearchDemo,
    RemoteSearchDemo,
    EmptyDemo,
    VirtualDemo,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
class SelectComponent {}
