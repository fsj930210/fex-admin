import { Controller, Get, Param, Query } from '@nestjs/common'
import { SearchTreeDto } from './dto/search-tree.dto.js'
import { TreeService } from './tree.service.js'

@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Get('roots')
  getRoots() {
    return this.treeService.getRoots()
  }

  @Get('search')
  search(@Query() query: SearchTreeDto) {
    return this.treeService.search(query.keyword)
  }

  @Get('search-tree')
  searchTree(@Query() query: SearchTreeDto) {
    return this.treeService.searchTree(query.keyword)
  }

  @Get('subtrees')
  getSubtrees(@Query('keys') keys = '') {
    return this.treeService.getSubtrees(keys.split(',').map((key) => key.trim()))
  }

  @Get('nodes/:key/children')
  getChildren(@Param('key') key: string) {
    return this.treeService.getChildren(key)
  }

  @Get('nodes/:key/subtree')
  getSubtree(@Param('key') key: string) {
    return this.treeService.getSubtree(key)
  }
}
